# Altogic CLI (Command Line Interface)
Altogic CLI is the command line interface to create, test and deploy full-code functions to your Altogic backend apps.

[Altogic](https://altogic.com) is a **backend application development and execution platform**, that enables people and businesses to design, deploy and manage scalable applications. It simplifies application development by eliminating repetitive tasks, providing pre-integrated and ready-to-use execution environments, and automating key stages in the application development process.

For complete documentation and other resources, go to [Altogic CLI documentation](https://www.altogic.com/docs/altogic-cli). 

## Installation

The Algotic CLI is a Node-based command line tool to help you interact with the Altogic Platform API.


### Install Using NPM

To install via [NPM](https://www.npmjs.com/)

```sh
$ npm install -g altogic-cli
```

Once the installation is complete, you can verify the installation using

```sh
$ altogic -v
```

### Dependencies
The following dependencies are required:
- Git


## Getting Started
Before using the CLI, you need to log in to your Altogic account.

```sh
$ altogic login
? Enter your email or username: test@myemail.com
? Enter your password: ********
```

> If you have signed up to your Account using your Google credentials, a 6-digit authorization code is sent to your email address. You need to type this code to complete your login.

Once authorized, your session information will be locally stored so that you do not need to log in again, until you log out from your active session. To log out from your current session, you can run the following command.

```sh
$ altogic logout
```


### Creating a cloud-function
Once logged in, you can create your full-code function. It will first ask you to select the application you want to create the function for. Following app selection, you need to provide a name to your function and select the runtime environment.

```sh
$ altogic create function

? To which application do you want to add the new function? 
  1) Random quotes (611e7f8ae1a047001ccb65a8)
  2) Book reviews (6124cfbacc2932001a1afc5c)
  3) Instangram clone (612bdfbb8aa25b0019206549)
(Move up and down to reveal more choices)
  Answer: 1

? What is the name of your function? send-daily-digest

? What is the runtime of your function? 
  1) node.js-14.5
  2) node.js-16.0
  3) node.js-18.0
  Answer: 2
```

The `create function` command will create a folder in your current directory using the name of your function and it will also create an `altogic.json` file to keep the configuration parameters.

You can use your code editor to write the code for your function. By default, the entrypoint of your cloud-function is `src/index.js` which exports the function code.


> If you change the entrypoint file of your function, you need to edit the entrypoint entry in `altogic.json` configuration file.

### Deploying a cloud-function
Once you are ready to deploy your function to your app environment, you can run the `deploy` command within the directory of the `altogic.json` file.


```sh
$ altogic deploy
```

> If you have a single execution environment for your app, your full-code function will be deployed to this environment. If you have more than one environment, you will be prompted to select the deployment environment.

Following the deploy command, Altogic will create the Docker image of your function and deploy it to your app's execution environment. Depending on the dependencies, **the build and deploy process can take a couple of minutes to complete**.

### Monitoring build and deploy status
Following the execution of the `deploy` command, you can monitor the status of your cloud-function build and deployment. For each deployment, Altogic creates a new Docker image of your cloud-function.

To get the status of builds, run `get builds` command.

```sh
$ altogic get builds
```

To get the status of deployments, run `get deployments` command.

```sh
$ altogic get deployments
```

### Accessing build and deployment logs
You can also access the entire build and deployment logs of your functions from the CLI. To get the build logs of a specific build of a function, run the following command with the build id value.

```sh
$ altogic logs build 6356704ca1695806f99a9eab
```

Similarly, to get the deployments logs of a specific deployment of a full-code function, run the following command with the deployment id value.

```sh
$ altogic logs build 6356704ca1695806f99a9eac
```

### Local testing of cloud-functions
You can test your node.js runtime functions locally by running the `start` command. This command will launch a local HTTP server and provide you the endpoint (URL) of the function. The `start` command has hot-reloading capabilities. It will watch for any changes to your files and restart the HTTP server.

```sh
$ altogic start

Local development HTTP server running at port:4000.
You can now test your function using the following endpoint: http://localhost:4000  
```

## Learn more

You can use the following resources to learn more and get help

-  🚀 [Quick start](https://www.altogic.com/docs/quick-start)
-  📜 [Altogic Docs](https://www.altogic.com/docs)
-  💬 [Discord community](https://discord.gg/ERK2ssumh8)
-  💬 [Discussion forums](https://community.altogic.com)

## Bugs Report

Think you’ve found a bug? Please, open an issue on [GitHub repository](https://github.com/altogic/altogic-cli/issues).

## Support / Feedback

For issues with, questions about, feedback for the client library, or want to see a new feature,
please, send us an email support@altogic.com or reach out to our discussion forums
https://community.altogic.com
