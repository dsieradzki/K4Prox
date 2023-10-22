/*
 Generated by typeshare 1.7.0
*/

export interface HelmApp {
	id?: string;
	chartName: string;
	chartVersion?: string;
	repository: string;
	releaseName: string;
	namespace: string;
	values?: string;
	wait?: boolean;
}

export interface ClusterResource {
	id: string;
	name: string;
	content: string;
}

export enum ClusterNodeType {
	Master = "master",
	Worker = "worker",
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
	/** Unit: MiB */
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

export enum ClusterState {
	Pending = "pending",
	Creating = "creating",
	Sync = "sync",
	OutOfSync = "outOfSync",
	Destroying = "destroying",
	Error = "error",
}

export interface ClusterStatus {
	state: ClusterState;
	lastUpdate: Date;
}

export enum ActionLogLevel {
	Info = "info",
	Error = "error",
}

export interface LogEntry {
	date: Date;
	clusterName: string;
	message: string;
	level: ActionLogLevel;
}

export interface Cluster {
	node: string;
	clusterName: string;
	osImage?: string;
	osImageStorage?: string;
	kubeVersion?: string;
	clusterConfig: string;
	sshKey: KeyPair;
	nodeUsername: string;
	nodePassword: string;
	helmApps: HelmApp[];
	clusterResources: ClusterResource[];
	/** Disk size id GiB */
	diskSize: number;
	nodes: ClusterNode[];
	network: Network;
	status: ClusterStatus;
}

export interface ClusterRequest {
	osImage: string;
	osImageStorage: string;
	kubeVersion: string;
	node: string;
	clusterName: string;
	sshKey: KeyPair;
	nodeUsername: string;
	nodePassword: string;
	helmApps: HelmApp[];
	clusterResources: ClusterResource[];
	/** Unit: GiB */
	diskSize: number;
	nodes: ClusterNode[];
	network: Network;
}

export interface ClusterHeader {
	name: string;
	nodesCount: number;
	coresSum: number;
	/** Unit: MiB */
	memorySum: number;
	/** Unit: GiB */
	diskSizeSum: number;
	status: ClusterStatus;
}

export enum KubeStatus {
	Ready = "ready",
	NotReady = "not_ready",
	Unknown = "unknown",
}

export interface ClusterNodeStatus {
	name: string;
	status: KubeStatus;
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
	id: string;
	status: AppStatusType;
}

export interface LoginRequest {
	host: string;
	port: number;
	username: string;
	password: string;
}

export enum VmStatus {
	Running = "running",
	Stopped = "stopped",
}

export interface ClusterNodeVmStatus {
	vmid: number;
	status: VmStatus;
}

export interface AvailableStorage {
	storage: string;
	/** Unit: MiB */
	avail?: number;
	/** Unit: MiB */
	used?: number;
	/** Unit: MiB */
	total?: number;
}

export interface AvailableNetwork {
	iface: string;
	address?: string;
}

export interface ChangeNodeResourcesRequest {
	cores: number;
	/** Unit: MiB */
	memory: number;
}

export interface AvailableOsImage {
	name: string;
	url: string;
}

export interface AvailableKubeVersion {
	version: string;
}

