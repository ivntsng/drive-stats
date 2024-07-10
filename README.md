# drive-stats

drive-stats: A tool for auto enthusiasts to meticulously track vehicle data, including mileage, mods, and service history, fostering efficient car management.

## Design

-   [API Designs]()
-   [Data Models]()
-   [GHI Wireframes]()
-   [Integrations]()

## Functionality

### Customers

## Project Initialization

### Install Dependencies

1. Install Python dependencies:

    ```sh
    pip install -r requirements.txt
    ```

2. Install `act` for running GitHub Actions locally:

    #### macOS with Homebrew:

    ```sh
    brew install act
    ```

    #### Linux:

    ```sh
    curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
    ```

### Running Pre-commit Hooks

1. Install the pre-commit hooks:

    ```sh
    pre-commit install
    ```

2. Make changes to your code and commit them. The pre-commit hooks will run automatically.

### Running GitHub Actions Locally with `act`

To test your GitHub Actions workflow locally, you can use `act`:

1. Ensure you have `act` installed (see installation steps above).

2. Run the following command to simulate a push event (Apple Silicon Chip):

    ```sh
    act push --container-architecture linux/amd64
    ```
