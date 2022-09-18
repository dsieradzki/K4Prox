package provisioner

import (
	"github.com/dsieradzki/k4prox/internal/collect"
	"github.com/dsieradzki/k4prox/internal/event"
	"github.com/dsieradzki/k4prox/internal/k4p"
	"github.com/dsieradzki/k4prox/internal/proxmox"
	"github.com/dsieradzki/k4prox/internal/ssh"
	"github.com/dsieradzki/k4prox/pkg/service/project"
	"sort"
)

func NewService(
	projectService *project.Service,
	proxmoxClient *proxmox.Client,
	sshClient *ssh.Client,
	eventCollector *event.Collector) *Service {
	return &Service{
		project:       projectService,
		proxmoxClient: proxmoxClient,
		k4p:           k4p.NewK4PService(proxmoxClient, sshClient, eventCollector),
	}
}

type Service struct {
	k4p           *k4p.Service
	proxmoxClient *proxmox.Client
	project       *project.Service
}

func (p *Service) SetupEnvironmentOnProxmox() error {
	return p.k4p.SetupEnvironmentOnProxmox()
}

func (p *Service) CreateCluster(provisionRequest k4p.ProvisionRequest) error {
	projectData, err := p.project.LoadProject()
	if err != nil {
		return err
	}
	if projectData.SshKey.Empty() {
		rsaKeyPair, err := ssh.GenerateRsaKeyPair()
		if err != nil {
			return err
		}
		projectData.SshKey = rsaKeyPair
		err = p.project.SaveProject(projectData)
		if err != nil {
			return err
		}
	}
	if provisionRequest.Stages.CreateVirtualMachines {
		err = p.k4p.CreateVirtualMachines(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}

		err = p.k4p.StartVirtualMachines(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}

		err = p.k4p.UpdateVmsOs(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}

		err = p.k4p.ShutdownVirtualMachines(projectData.Cluster)
		if err != nil {
			return err
		}

		err = p.k4p.StartVirtualMachines(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}

	if provisionRequest.Stages.SetupVirtualMachines {
		err = p.k4p.SetupVmsOs(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}

	if provisionRequest.Stages.InstallKubernetes {
		err = p.k4p.InstallKubernetesOnNodes(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}
	if provisionRequest.Stages.JoinNodesToCluster {
		err = p.k4p.JoinNodesToCluster(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}

	if provisionRequest.Stages.InstallKubernetes {
		kubeConfigContent, err := p.k4p.GetKubeConfigFromCluster(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
		projectDataToUpdate, err := p.project.LoadProject()
		if err != nil {
			return err
		}
		projectDataToUpdate.KubeConfig = kubeConfigContent
		projectData = projectDataToUpdate
		err = p.project.SaveProject(projectDataToUpdate)
		if err != nil {
			return err
		}
	}

	if provisionRequest.Stages.InstallAddons {
		err = p.k4p.InstallAddons(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}
	if provisionRequest.Stages.InstallHelmApps {
		err = p.k4p.InstallHelmApps(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}
	if provisionRequest.Stages.InstallCustomHelmApps {
		err = p.k4p.InstallCustomHelmApps(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}
	if provisionRequest.Stages.InstallCustomK8sResources {
		err = p.k4p.InstallAdditionalK8sResources(projectData.Cluster, projectData.SshKey)
		if err != nil {
			return err
		}
	}

	return nil
}

func (p *Service) GetNetworkBridges() ([]string, error) {
	networks, err := p.proxmoxClient.GetNetworkBridges(p.proxmoxClient.GetProxmoxNodeName())
	if err != nil {
		return []string{}, err
	}
	netNames := collect.Map(networks, func(n proxmox.Network) string {
		return n.Iface
	})
	sort.Strings(netNames)
	return netNames, nil
}

func (p *Service) GetStorage() ([]string, error) {
	storage, err := p.proxmoxClient.GetStorage()
	if err != nil {
		return []string{}, err
	}
	storageNames := collect.Map(storage, func(i proxmox.Storage) string {
		return i.StorageName
	})
	sort.Strings(storageNames)
	return storageNames, nil
}
