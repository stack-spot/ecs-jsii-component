# container-env-jsii-component

Component to create a container environment.

## How to use

Below are all languages supported by the AWS CDK.

### C#

Install the dependency:

```sh
dotnet add package OrangeStack.Components.Env.Container
```

Import the construct into your project, for example:

```csharp
using Amazon.CDK;
using Amazon.CDK.AWS.EC2;
using Constructs;
using OrangeStack.Components.Env.Container;

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
npm install --save @orange-stack/container-env-component
```

Import the construct into your project, for example:

```javascript
const { Stack } = require('aws-cdk-lib');
const { SubnetType } = require('aws-cdk-lib/aws-ec2');
const { ContainerEnvComponent } = require('@orange-stack/container-env-component');

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
npm install --save @orange-stack/container-env-component
```

Import the construct into your project, for example:

```typescript
import { Stack, StackProps } from 'aws-cdk-lib';
import { SubnetType } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { ContainerEnvComponent } from '@orange-stack/container-env-component';

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

[aws-cdk-cluster]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.Cluster.html
[aws-cdk-subnet-selection]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.SubnetSelection.html
[aws-cdk-ivpc]: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ec2.IVpc.html
[editorconfig]: https://editorconfig.org/
[git]: https://git-scm.com/downloads
[nodejs]: https://nodejs.org/en/download/
