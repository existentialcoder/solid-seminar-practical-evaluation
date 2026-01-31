# Solid Seminar Evaluation
## Intro
- The project's aim is to setup a working Community Solid server locally using `Docker`
- Parallely run 3 applications - MediaKraken, Solid File Manager and Solid Cinema to achieve and demonstrate data interoperability
- For more details on my first Solid app, check [Solid Cinema](./my-apps/solid-cinema-vue/README.md)
## Setup
- Clone the repository
- Make sure `docker` is pre-installed
- Run all the applications using the below command

    ``` sh
    docker compose up -d
    ```
- To bring down any of the service or all
    ``` sh
    docker compose down # Prefix with the app name
    ```
