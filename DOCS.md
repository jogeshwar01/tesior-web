# Documentation

## Getting Started

1. **Open [Tesior Web](https://tesior-web.vercel.app)** and click on **Sign In**.

![Home Page](https://github.com/user-attachments/assets/b9b2e982-b50f-4a20-b00e-8309256f9db1 "Home Page")

   - Log in with your GitHub account.

![Login Page](https://github.com/user-attachments/assets/06b85a65-7f26-4e19-89a2-026893d39960 "Login Page")

2. **Create a Workspace**

   After logging in, you will see the dashboard. If you just signed in, you will have no workspaces. Create one by clicking the **Add Workspace** button. Provide a unique workspace name and link it with the GitHub repository you want to send bounties from.

![Add Workspace Page](https://github.com/user-attachments/assets/c706571d-50b8-41c1-b2fd-8e05af4d1fdd "Add Workspace Page")

![Add Workspace Modal](https://github.com/user-attachments/assets/e81ab2a5-2b67-4cff-be04-f90e5fa1881b "Add Workspace Modal")

3. **Workspace Dashboard**

   Once you create the workspace, you will be redirected to the workspace dashboard. Here, you can:
   - Create tasks
   - Approve/reject tasks
   - Pay for tasks
   - View all transfers for a project

   You can also manage team members in the settings tab for a project. All bounties sent via GitHub comments will be visible under the tasks section.

![Workspace Dashboard](https://github.com/user-attachments/assets/dddd53f1-d260-47a2-90c2-8d67e2179b04)

4. **Manage Payments and Wallet**

   In the top right corner, you will find two tabs: **Payments** and **Wallet**.
   - **Wallet**: This tab is your Tesior Wallet, where your Solana funds are stored. You can deposit or withdraw funds.
   - **Payments**: All transactions to and from your Tesior Wallet are listed here.

   Note: Due to cron jobs set up to clear funds, it may take up to a day for the updated funds to reflect in your Tesior Wallet.

![Wallet Page](https://github.com/user-attachments/assets/ce3bd7a0-dbe1-496b-bc59-2206ec663416 "Wallet Page")

5. **Setting Up Bounties via GitHub**

   To set up bounties through GitHub, install the Tesior bot in your GitHub repository. Ensure that the repository is connected to a workspace on Tesior. Once set up, all comments in the format `/bounty <amount>` will be treated as bounties and processed on Tesior.

![GitHub Bounties](https://github.com/user-attachments/assets/584eed95-3e99-476d-9a71-8899adac6a45 "GitHub Bounties")

Enjoy using Tesior Web to manage your projects and bounties seamlessly!
