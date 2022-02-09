# container-env-jsii-component

[![aws-cdk][badge-aws-cdk]][aws-cdk]
[![jsii][badge-jsii]][jsii]
[![npm-version][badge-npm-version]][npm-package]
[![nuget-version][badge-nuget-version]][nuget-package]
[![npm-downloads][badge-npm-downloads]][npm-package]
[![nuget-downloads][badge-nuget-downloads]][nuget-package]
[![license][badge-license]][license]

Component to create a container environment.

## How to use

Below are all languages supported by the AWS CDK.

### C#

Install the dependency:

```sh
dotnet add package StackSpot.Env.Container
```

Import the construct into your project, for example:

```csharp
using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using Constructs;
using StackSpot.Env.Container;

namespace MyStack
{
    public class MyStack : Stack
    {
        internal MyStack(Construct scope, string id, IStackProps props = null) : base(scope, id, props)
        {
            string[] subnetIds = {
                "subnet-xxxxxxxxxxxxxxxxx",
                "subnet-xxxxxxxxxxxxxxxxx",
                "subnet-xxxxxxxxxxxxxxxxx"
            };

            ContainerEnvComponent environment = new ContainerEnvComponent(this, "MyEcs", new ContainerEnvComponentProps{
                SubnetIds = subnetIds,
                SubnetType = SubnetType.PRIVATE_ISOLATED,
                VpcId = "vpc-xxxxxxxxxxxxxxxxx"
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
npm install --save @stackspot/cdk-env-container
```

Import the construct into your project, for example:

```javascript
const { Stack } = require('aws-cdk-lib');
const { SubnetType } = require('aws-cdk-lib/aws-ec2');
const { ContainerEnvComponent } = require('@stackspot/cdk-env-container');

class MyStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const environment = new ContainerEnvComponent(this, 'MyEcs', {
      subnetIds: [
        'subnet-xxxxxxxxxxxxxxxxx',
        'subnet-xxxxxxxxxxxxxxxxx',
        'subnet-xxxxxxxxxxxxxxxxx',
      ],
      subnetType: SubnetType.PRIVATE_ISOLATED,
      vpcId: 'vpc-xxxxxxxxxxxxxxxxx',
    });
  }
}

module.exports = { MyStack }
```

### Python

Not yet supported.

### TypeScript

Install the dependency:

```sh
npm install --save @stackspot/cdk-env-container
```

Import the construct into your project, for example:

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ContainerEnvComponent } from '@stackspot/cdk-env-container';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const environment = new ContainerEnvComponent(this, 'MyEcs', {
      subnetIds: [
        'subnet-xxxxxxxxxxxxxxxxx',
        'subnet-xxxxxxxxxxxxxxxxx',
        'subnet-xxxxxxxxxxxxxxxxx',
      ],
      subnetType: SubnetType.PRIVATE_ISOLATED,
      vpcId: 'vpc-xxxxxxxxxxxxxxxxx',
    });
  }
}
```

## Construct Props

| Name                 | Type                                        | Description                                                                            |
| -------------------- | ------------------------------------------- | -------------------------------------------------------------------------------------- |
| clusterName          | string                                      | The name for the cluster. Default: ContainerEnvComponentCluster.                       |
| containerInsights    | boolean                                     | If true CloudWatch Container Insights will be enabled for the cluster. Default: true.  |
| subnets              | [SubnetSelection][aws-cdk-subnet-selection] | The subnets to be used.                                                                |
| vpc                  | [iVpc][aws-cdk-ivpc]                        | The VPC to be used.                                                                    |

## Properties

| Name                | Type                                                         | Description                               |
| ------------------- | ------------------------------------------------------------ | ----------------------------------------- |
| cluster             | [Cluster][aws-cdk-cluster]                                   | Cluster that will be created.             |

## IAM Least privilege

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "cloudformation:Describe*",
                "cloudformation:List*",
                "cloudformation:Get*"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::cdktoolkit-stagingbucket-*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "ssm:GetParameters",
                "ecs:DescribeClusters",
                "ecs:CreateCluster",
                "ecs:DeleteCluster",
                "ec2:CreateTags",
                "ec2:CreateVpc",
                "ec2:CreateSubnet",
                "ec2:CreateRouteTable",
                "ec2:CreateRoute",
                "ec2:CreateInternetGateway",
                "ec2:CreateNatGateway",
                "ec2:DescribeVpcs",
                "ec2:DescribeNatGateways",
                "ec2:DescribeAddresses",
                "ec2:DescribeSubnets",
                "ec2:DescribeRouteTables",
                "ec2:DescribeAvailabilityZones",
                "ec2:DescribeInternetGateways",
                "ec2:AttachInternetGateway",
                "ec2:allocateAddress",
                "ec2:AssociateRouteTable",
                "ec2:ModifyVpcAttribute",
                "ec2:ModifySubnetAttribute",
                "ec2:ReplaceRoute",
                "ec2:DeleteRoute",
                "ec2:DeleteVpc",
                "ec2:DeleteTags",
                "ec2:DeleteSubnet",
                "ec2:DeleteInternetGateway",
                "ec2:DeleteRouteTable",
                "ec2:DetachInternetGateway",
                "ec2:DeleteNatGateway",
                "ec2:releaseAddress",
                "ec2:DisassociateRouteTable"
            ],
            "Resource": "*",
            "Effect": "Allow"
        }
    ]
}
```

Usage:

```sh
cdk bootstrap \
  --public-access-block-configuration false \
  --trust <account-id> \
  --cloudformation-execution-policies arn:aws:iam::<account-id>:policy/<policy-name> \
  aws://<account-id>/<region>

cdk deploy
```

## Development

### Prerequisites

- [EditorConfig][editorconfig] (Optional)
- [Git][git]
- [Node.js 16][nodejs]

### Setup

```sh
cd container-env-jsii-component
npm install
```

You are done! Happy coding!

[aws-cdk]: https://aws.amazon.com/cdk
[aws-cdk-cluster]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Cluster.html
[aws-cdk-subnet-selection]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetSelection.html
[aws-cdk-ivpc]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html
[badge-aws-cdk]: https://img.shields.io/github/package-json/dependency-version/stack-spot/container-env-jsii-component/aws-cdk-lib
[badge-jsii]: https://img.shields.io/github/package-json/dependency-version/stack-spot/container-env-jsii-component/dev/jsii
[badge-license]: https://img.shields.io/github/license/stack-spot/container-env-jsii-component
[badge-npm-downloads]: https://img.shields.io/npm/dt/@stackspot/cdk-env-container?label=downloads%20%28npm%29
[badge-npm-version]: https://img.shields.io/npm/v/@stackspot/cdk-env-container
[badge-nuget-downloads]: https://img.shields.io/nuget/dt/StackSpot.Env.Container?label=downloads%20%28NuGet%29
[badge-nuget-version]: https://img.shields.io/nuget/vpre/StackSpot.Env.Container
[editorconfig]: https://editorconfig.org/
[git]: https://git-scm.com/downloads
[jsii]: https://aws.github.io/jsii/
[license]: https://github.com/stack-spot/container-env-jsii-component/blob/main/LICENSE
[nodejs]: https://nodejs.org/en/download/
[npm-package]: https://www.npmjs.com/package/@stackspot/cdk-env-container
[nuget-package]: https://www.nuget.org/packages/StackSpot.Env.Container
