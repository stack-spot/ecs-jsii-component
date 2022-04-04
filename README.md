# container-env-jsii-component

[![aws-cdk][badge-aws-cdk]][aws-cdk]
[![jsii][badge-jsii]][jsii]
[![npm-version][badge-npm-version]][npm-package]
[![nuget-version][badge-nuget-version]][nuget-package]
[![npm-downloads][badge-npm-downloads]][npm-package]
[![nuget-downloads][badge-nuget-downloads]][nuget-package]
[![license][badge-license]][license]

Component for managing an ECS cluster.

## How to use

Below are all languages supported by the AWS CDK.

### C#

Install the dependency:

```sh
dotnet add package StackSpot.Cdk.Ecs
```

Import the construct into your project, for example:

```csharp
using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using Constructs;
using StackSpot.Cdk.Ecs;

namespace MyStack
{
    public class MyStack : Stack
    {
        internal MyStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            Vpc vpc = new Vpc(this, "VPC");

            Ecs ecs = new Ecs(this, "MyEcs", new EcsCreateProps{
                ClusterName = "MyCluster",
                Vpc = vpc
            });
        }
    }
}
```

### F#

Not yet supported.

### Go

Not yet supported.

### Java

Not yet supported.

### JavaScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-ecs
```

Import the construct into your project, for example:

```javascript
const { Stack } = require('aws-cdk-lib');
const { Vpc } = require('aws-cdk-lib/aws-ec2');
const { Ecs } = require('@stackspot/cdk-ecs');

class MyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const ecs = new Ecs(this, 'MyCluster', {
      clusterName: 'MyCluster',
      vpc: new Vpc(this, 'MyVpc'),
    });
  }
}

module.exports = { MyStack };
```

### Python

Not yet supported.

### TypeScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-ecs
```

Import the construct into your project, for example:

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { Ecs } from '@stackspot/cdk-ecs';

class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const ecs = new Ecs(this, 'MyCluster', {
      clusterName: 'MyCluster',
      vpc: new Vpc(this, 'MyVpc'),
    });
  }
}

export default MyStack;
```

## Construct Props

| Name               | Type                     | Description                                                                            |
| ------------------ | ------------------------ | -------------------------------------------------------------------------------------- |
| clusterName        | string                   | The name for the cluster.                                                              |
| containerInsights? | boolean                  | If true CloudWatch Container Insights will be enabled for the cluster. Default: false. |
| vpc                | [IVpc][aws-cdk-ec2-ivpc] | The VPC to be used.                                                                    |

## Another Props

### TaskDefinitionCreateProps

| Name           | Type                                  | Description                                         |
| -------------- | ------------------------------------- | --------------------------------------------------- |
| containerImage | string                                | The container image to deploy.                      |
| containerName  | string                                | The name of the container within the cluster.       |
| containerPort  | number                                | The container port.                                 |
| cpu            | string                                | The amount of CPU to use.                           |
| hostPort       | number                                | The host port.                                      |
| memoryMiB      | string                                | The amount of memory in MiB to use.                 |
| publicIp       | boolean                               | Represents whether the cluster will have public IP. |
| subnetType     | [SubnetType][aws-cdk-ec2-subnet-type] | The type of subnet to use.                          |
| vpc            | [IVpc][aws-cdk-ec2-ivpc]              | The VPC to use.                                     |

## Properties

| Name    | Type                           | Description                   |
| ------- | ------------------------------ | ----------------------------- |
| cluster | [Cluster][aws-cdk-ecs-cluster] | Cluster that will be created. |

## Methods

| Name                                                            | Description                                                         |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| addTaskDefinition(scope, props)                                 | Add a task definition to the AWS ECS cluster.                       |
| static addTaskDefinitionFromStackEcs(scope, clusterName, props) | Add a task definition to the AWS ECS cluster from the cluster name. |

### addTaskDefinition(scope, props)

```typescript
public addTaskDefinition(scope: Construct, props: TaskDefinitionCreateProps): EcsRunTask
```

_Parameters_

- **scope** [Construct][aws-cdk-construct]
- **props** [TaskDefinitionCreateProps](#taskdefinitioncreateprops)

_Returns_

- [EcsRunTask][aws-cdk-step-functions-tasks-ecs-run-task]

Add a task definition to the AWS ECS cluster.

### static addTaskDefinitionFromStackEcs(scope, clusterName, props)

```typescript
public static addTaskDefinitionFromStackEcs(scope: Construct, clusterName: string, props: TaskDefinitionCreateProps): EcsRunTask
```

_Parameters_

- **scope** [Contruct][aws-cdk-construct]
- **clusterName** string
- **props** [TaskDefinitionCreateProps](#taskdefinitioncreateprops)

_Returns_

- [EcsRunTask][aws-cdk-step-functions-tasks-ecs-run-task]

Add a task definition to the AWS ECS cluster from the cluster name.

## IAM Least privilege

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:AllocateAddress",
        "ec2:AssociateRouteTable",
        "ec2:AttachInternetGateway",
        "ec2:CreateInternetGateway",
        "ec2:CreateNatGateway",
        "ec2:CreateRoute",
        "ec2:CreateRouteTable",
        "ec2:CreateSubnet",
        "ec2:CreateTags",
        "ec2:CreateVpc",
        "ec2:DeleteInternetGateway",
        "ec2:DeleteNatGateway",
        "ec2:DeleteRoute",
        "ec2:DeleteRouteTable",
        "ec2:DeleteSubnet",
        "ec2:DeleteTags",
        "ec2:DeleteVpc",
        "ec2:DescribeAddresses",
        "ec2:DescribeAvailabilityZones",
        "ec2:DescribeInternetGateways",
        "ec2:DescribeNatGateways",
        "ec2:DescribeRouteTables",
        "ec2:DescribeSubnets",
        "ec2:DescribeVpcs",
        "ec2:DetachInternetGateway",
        "ec2:DisassociateRouteTable",
        "ec2:ModifySubnetAttribute",
        "ec2:ModifyVpcAttribute",
        "ec2:ReleaseAddress",
        "ec2:ReplaceRoute",
        "ecs:CreateCluster",
        "ecs:DeleteCluster",
        "ecs:DescribeClusters",
        "ssm:GetParameters"
      ],
      "Resource": "*"
    }
  ]
}
```

## Development

### Prerequisites

- [EditorConfig][editorconfig] (Optional)
- [Git][git]
- [Node.js][nodejs] 17

### Setup

```sh
cd ecs-jsii-component
npm install
```

[aws-cdk]: https://aws.amazon.com/cdk
[aws-cdk-construct]: https://docs.aws.amazon.com/cdk/api/v2/docs/constructs.Construct.html
[aws-cdk-ec2-ivpc]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html
[aws-cdk-ec2-subnet-type]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetType.html
[aws-cdk-ecs-cluster]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Cluster.html
[aws-cdk-step-functions-tasks-ecs-run-task]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_stepfunctions_tasks.EcsRunTask.html
[badge-aws-cdk]: https://img.shields.io/github/package-json/dependency-version/stack-spot/ecs-jsii-component/dev/aws-cdk-lib
[badge-jsii]: https://img.shields.io/github/package-json/dependency-version/stack-spot/ecs-jsii-component/dev/jsii
[badge-license]: https://img.shields.io/github/license/stack-spot/ecs-jsii-component
[badge-npm-downloads]: https://img.shields.io/npm/dt/@stackspot/cdk-ecs?label=downloads%20%28npm%29
[badge-npm-version]: https://img.shields.io/npm/v/@stackspot/cdk-ecs
[badge-nuget-downloads]: https://img.shields.io/nuget/dt/StackSpot.Cdk.Ecs?label=downloads%20%28NuGet%29
[badge-nuget-version]: https://img.shields.io/nuget/vpre/StackSpot.Cdk.Ecs
[editorconfig]: https://editorconfig.org/
[git]: https://git-scm.com/downloads
[jsii]: https://aws.github.io/jsii/
[license]: https://github.com/stack-spot/ecs-jsii-component/blob/main/LICENSE
[nodejs]: https://nodejs.org/en/download/
[npm-package]: https://www.npmjs.com/package/@stackspot/cdk-ecs
[nuget-package]: https://www.nuget.org/packages/StackSpot.Cdk.Ecs
