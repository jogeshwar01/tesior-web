export function convertIssueData(originalData: any) {
  return {
    issue: {
      url: originalData?.issue?.url,
      user: {
        login: originalData?.issue?.user?.login,
      },
      comment: {
        body: originalData?.comment?.body,
        user: {
          login: originalData?.comment?.user?.login,
        },
      },
      repository: {
        url: originalData?.repository?.url,
        name: originalData?.repository?.name,
        owner: {
          login: originalData?.repository?.owner?.login,
        },
      },
    },
  };
}
