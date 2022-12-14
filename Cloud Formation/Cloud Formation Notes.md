## AWS CloudFormation simplifies provisioning and management on AWS. 

### CLoud Formation is like - Infrastructure as a code  : we can use .JSON/.YAML/.template/.txt code to create infrastructure (resources like vpc, ec2, route 53 etc) or CloudFormation Designer to graphically design your stack on a simple, drag-and-drop interface. 

**We can create templates for the service or application architectures you want and have AWS CloudFormation use those templates for quick and reliable provisioning of the services or applications (called “stacks”). You can also easily update or replicate the stacks as needed.**

## Cloud formation have sample template from AWS end or we can create our own template.

## Cloud formation create stack, that stack can be update (There is update button)
**Once we update stack(template yaml file) and run it it will lose data in terms of database so we need to keep backup first**
**In terms of ec2 instance, update event will terminate previously created instance and again create new instance**

## To keep things as it is then use "change-set" event in cloud formation (Inside stack action button->create change set for current stack)

## Stack is group of resources, we can use template to create our cloud infrastructure in aws and share with your other teams/organization to create same within less time(we save the time and effort using cloud formation)

### When you directly update a stack, you submit changes and AWS CloudFormation immediately deploys them. Use direct updates when you want to quickly deploy your updates. With change sets, you can preview the changes AWS CloudFormation will make to your stack, and then decide whether to apply those changes.

## Sometimes resources changed with data loss if we change particular property like keypair then we need to terminate instance and create new instance we can not change key pair for ec2 but by stpping instance we can change type of instance from t2 micro to t2 small

## Template sections are as below
### 1. AWS template format version 
### 2. Description
### 3. Meta Data
### 4. Parameters
### 5. Mapping 
### 6. Conditions
### 7. Outputs
### 8. Resources