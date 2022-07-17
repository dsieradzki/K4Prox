package k4p

import (
	"github.com/dsieradzki/K4Prox/internal/event"
	"github.com/dsieradzki/K4Prox/internal/proxmox"
	"github.com/dsieradzki/K4Prox/internal/ssh"
)

const k4pToysDir = "/var/k4p"
const linuxCloudImageFileName = "jammy-server-cloudimg-amd64.img"
const linuxCloudImage = "https://cloud-images.ubuntu.com/jammy/current/" + linuxCloudImageFileName

func NewK4PService(
	proxmoxClient *proxmox.Client,
	proxmoxSsh *ssh.Client,
	eventCollector *event.Collector) *Service {
	return &Service{
		proxmoxClient:  proxmoxClient,
		proxmoxSsh:     proxmoxSsh,
		eventCollector: eventCollector,
	}
}

type Service struct {
	proxmoxClient  *proxmox.Client
	proxmoxSsh     *ssh.Client
	eventCollector *event.Collector
}

func (k *Service) GetEvents() []event.Event {
	return k.eventCollector.Get()
}
func (k *Service) ClearEvents() int {
	return k.eventCollector.Clear()
}

func (k *Service) SetupEnvironmentOnProxmox() error {
	eventSession := k.eventCollector.Startf("Prepare [%s] data directory on Proxmox", k4pToysDir)
	result, err := k.proxmoxSsh.Executef("mkdir %s -p", k4pToysDir)
	if err != nil {
		eventSession.ReportError(err)
		return err
	}
	if result.IsError() {
		eventSession.ReportError(result.Error())
		return result.Error()
	}
	eventSession.Done()
	//
	//
	//
	eventSession = k.eventCollector.Start("Check availability of linux cloud image")
	result, err = k.proxmoxSsh.Executef("test -e %s", k4pToysDir+"/"+linuxCloudImageFileName)
	if err != nil {
		eventSession.ReportError(err)
		return err
	}
	shouldDownloadLinuxImage := false
	if result.IsError() {
		if result.Code() == 1 {
			shouldDownloadLinuxImage = true
		} else {
			eventSession.ReportError(result.Error())
			return result.Error()
		}
	}
	eventSession.Done()
	//
	//
	//
	if shouldDownloadLinuxImage {
		eventSession = k.eventCollector.Startf("Download linux cloud image to [%s]", k4pToysDir)
		result, err = k.proxmoxSsh.Executef("wget -q %s -P %s", linuxCloudImage, k4pToysDir)
		if err != nil {
			eventSession.ReportError(err)
			return err
		}
		if result.IsError() {
			eventSession.ReportError(result.Error())
			return result.Error()
		}
		eventSession.Done()
	}
	return nil
}
