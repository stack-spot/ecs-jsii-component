import { App, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { SubnetType, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import { EcsCreate } from '../lib/index';

describe('EcsCreate', () => {
  test('create cluster property', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    const environment = new EcsCreate(stack, 'TestConstruct', {
      clusterName: 'TestEcsCluster',
      subnets,
      vpc,
      containerInsights: false,
    });

    expect(environment.cluster).toBeInstanceOf(Cluster);
  });

  test('create cluster property with container insights', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    const environment = new EcsCreate(stack, 'TestConstruct', {
      clusterName: 'TestEcsCluster',
      subnets,
      vpc,
      containerInsights: true,
    });

    expect(environment.cluster).toBeInstanceOf(Cluster);
  });

  test('has only one VPC', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new EcsCreate(stack, 'TestConstruct', {
      clusterName: 'TestEcsCluster',
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::EC2::VPC', 1);
  });

  test('has the option to change the cluster name', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const vpc = new Vpc(stack, 'TestVpc');
    const subnets = vpc.selectSubnets({
      onePerAz: true,
      subnetType: SubnetType.PUBLIC,
    });
    new EcsCreate(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      subnets,
      vpc,
    });
    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterName: 'TestCluster',
    });
  });

  test('create cluster and add task definition', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const mockvpc = new Vpc(stack, 'NewVPC', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [{
        cidrMask: 26,
        name: 'isolatedSubnet',
        subnetType: SubnetType.PUBLIC,
      }],
      natGateways: 0,
    });
    const subnets = mockvpc.selectSubnets({
      subnetType: SubnetType.PUBLIC,
    });
    const ecsCluster = new EcsCreate(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      subnets,
      vpc: mockvpc,
    });
    const template = Template.fromStack(stack);

    ecsCluster.addTaskDefinition(
      stack,
      {
        vpc: mockvpc,
        containerName: 'TestContainer',
        containerImage: 'amazon/amazon-ecs-sample',
        cpu: '256',
        memoryMiB: '512',
        containerPort: 80,
        hostPort: 80,
        publicIp: true,
        subnetType: SubnetType.PUBLIC,
      },
    );

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterName: 'TestCluster',
    });
  });

  test('add task definition to an existing cluster', () => {
    const app = new App();
    const stack = new Stack(app, 'TestStack');
    const mockvpc = new Vpc(stack, 'NewVPC', {
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      subnetConfiguration: [{
        cidrMask: 26,
        name: 'isolatedSubnet',
        subnetType: SubnetType.PUBLIC,
      }],
      natGateways: 0,
    });
    const subnets = mockvpc.selectSubnets({
      subnetType: SubnetType.PUBLIC,
    });
    new EcsCreate(stack, 'TestConstruct', {
      clusterName: 'TestCluster',
      subnets,
      vpc: mockvpc,
    });
    const template = Template.fromStack(stack);

    EcsCreate.addTaskDefinitionFromStackECS(
      stack,
      'TestCluster',
      {
        vpc: mockvpc,
        containerName: 'TestContainer',
        containerImage: 'amazon/amazon-ecs-sample',
        cpu: '256',
        memoryMiB: '512',
        containerPort: 80,
        hostPort: 80,
        publicIp: true,
        subnetType: SubnetType.PUBLIC,
      },
    );

    template.hasResourceProperties('AWS::ECS::Cluster', {
      ClusterName: 'TestCluster',
    });
  });
});
