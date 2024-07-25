export const extractAmount = (comment: string) => {
  const bountyExtractor = /\/bounty\s+(\$?\d+|\d+\$)/;

  const match = comment.match(bountyExtractor);
  return match ? parseInt(match[1] ?? "0") : null;
};

export const isBountyComment = (comment: string) => {
  return comment.trim().toLocaleLowerCase().startsWith("/bounty");
};
