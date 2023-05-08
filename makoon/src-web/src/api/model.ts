/*
 Generated by typeshare 1.1.0
*/


export interface NodeStatus {
    vmid: number;
    vmStatus: string;
    k8sStatus: string;
}

export interface LoginRequest {
    host: string;
    port: number;
    username: string;
    password: string;
}

export interface HelmApp {
    id: string;
    chartName: string;
    chartVersion: string;
    repository: string;
    releaseName: string;
    namespace: string;
    values: string;
    wait: boolean;
}

export interface ClusterResource {
    id: string;
    name: string;
    content: string;
}

export enum ClusterNodeLock {
    Create = "create",
    Delete = "delete",
    ChangeResources = "changeResources",
}

export interface ClusterNode {
    vmId: number;
    name: string;
    cores: number;
    memory: number;
    ipAddress: string;
    storagePool: string;
    nodeType: ClusterNodeType;
    lock?: ClusterNodeLock;
}

export interface Network {
    gateway: string;
    subnetMask: number;
    dns: string;
    bridge: string;
}

export interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export interface ActionLogEntry {
    date: Date;
    clusterName: string;
    message: string;
    level: ActionLogLevel;
}

export interface Cluster {
    node: string;
    clusterName: string;
    clusterConfig: string;
    sshKey: KeyPair;
    nodeUsername: string;
    nodePassword: string;
    helmApps: HelmApp[];
    clusterResources: ClusterResource[];
    diskSize: number;
    nodes: ClusterNode[];
    network: Network;
    status: ClusterStatus;
}

export interface ClusterRequest {
    osImage: string,
    osImageStorage: string,
    kubeVersion: string,
    node: string;
    clusterName: string;
    sshKey: KeyPair;
    nodeUsername: string;
    nodePassword: string;
    helmApps: HelmApp[];
    clusterResources: ClusterResource[];
    diskSize: number;
    nodes: ClusterNode[];
    network: Network;
}

export interface ClusterHeader {
    name: string;
    nodesCount: number;
    coresSum: number;
    memorySum: number;
    diskSizeSum: number;
    status: ClusterStatus;
}

export enum ClusterNodeType {
    Master = "master",
    Worker = "worker",
}

export enum ClusterStatus {
    Pending = "pending",
    Creating = "creating",
    Sync = "sync",
    OutOfSync = "outOfSync",
    Destroying = "destroying",
    Error = "error",
}

export enum ActionLogLevel {
    Info = "info",
    Error = "error",
}

export enum VmStatus {
    Running = "running",
    Stopped = "stopped",
}

export interface ClusterNodeVmStatus {
    vmid: number;
    status: VmStatus;
}

export enum KubeStatus {
    Ready = "ready",
    NotReady = "not_ready",
    Unknown = "unknown"
}

export interface ClusterNodeStatus {
    name: string,
    status: KubeStatus,
}


export enum AppStatusType {
    Unknown = "unknown",
    Deployed = "deployed",
    Uninstalled = "uninstalled",
    Superseded = "superseded",
    Failed = "failed",
    Uninstalling = "uninstalling",
    PendingInstall = "pending-install",
    PendingUpgrade = "pending-upgrade",
    PendingRollback = "pending-rollback",
    NotInstalled = "not-installed",
}

export interface AppStatus {
    id: string,
    status: AppStatusType,
}

export interface AvailableNetwork {
    iface: string,
    address?: string,
}

export interface AvailableStorage {
    storage: string,
    avail?: number,
    used?: number,
    total?: number,
}

export interface ChangeNodeResourcesRequest {
    cores: number,
    memory: number,
}
