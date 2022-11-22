import React from 'react';
import Table from "@/components/Table/Table";
import VmStatusComponent from "@/views/ClusterManagement/components/Nodes/VmStatusComponent";
import K8sStatusComponent from "@/views/ClusterManagement/components/Nodes/K8sStatusComponent";
import { KubernetesNodeWithStatus } from "@/store/clusterManagementStore";



type Props = {
    clusterName: string
    nodes: KubernetesNodeWithStatus[]
    selectedId: string | null
    onClick: (id: any) => void
}
const TableNodes = (props: Props) => {
    return <>
        {
            props.nodes.length == 0
                ? <div className="w-full text-2xl text-stone-600 text-center">No nodes</div>
                : <Table>
                    <Table.Header>Node name</Table.Header>
                    <Table.Header>VM Id</Table.Header>
                    <Table.Header>CPU</Table.Header>
                    <Table.Header>RAM</Table.Header>
                    <Table.Header>IP</Table.Header>
                    <Table.Header>VM</Table.Header>
                    <Table.Header>K8S</Table.Header>
                    {
                        props.nodes.map((kNode, idx) =>
                            <Table.Row
                                key={idx}
                                id={kNode.vmid}
                                selected={kNode.vmid.toString() === props.selectedId}
                                onClick={props.onClick}>
                                <Table.Column className="font-bold">
                                    {props.clusterName}-{kNode.name}
                                </Table.Column>
                                <Table.Column>
                                    {kNode.vmid}
                                </Table.Column>
                                <Table.Column>
                                    {kNode.cores} cores
                                </Table.Column>
                                <Table.Column>
                                    {kNode.memory} MB
                                </Table.Column>
                                <Table.Column>
                                    {kNode.ipAddress}
                                </Table.Column>
                                <Table.Column className="max-h-[58px]">
                                    <VmStatusComponent status={kNode.vmStatus}/>
                                </Table.Column>
                                <Table.Column className="max-h-[58px]">
                                    <K8sStatusComponent status={kNode.k8sStatus} vmStatusProblem={kNode.vmStatus == "down"}/>
                                </Table.Column>
                            </Table.Row>
                        )
                    }

                </Table>
        }
    </>
};

export default TableNodes;