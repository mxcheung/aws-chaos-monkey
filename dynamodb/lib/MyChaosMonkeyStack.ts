import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as path from 'path';

class MyChaosMonkeyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a Lambda function
    const chaosMonkeyFunction = new lambda.Function(this, 'ChaosMonkeyFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, 'lambda')),
    });

    // Grant the Lambda function permissions to delete the DynamoDB table
    const tableArn = `arn:aws:dynamodb:${this.region}:${this.account}:table/MyTable`;
    chaosMonkeyFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['dynamodb:DeleteTable'],
      resources: [tableArn],
    }));
  }
}

const app = new cdk.App();
new MyChaosMonkeyStack(app, 'MyChaosMonkeyStack');
