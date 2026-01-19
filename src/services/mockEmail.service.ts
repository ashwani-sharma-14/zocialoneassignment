export const sendMockEmail = async (
  toEmail: string,
  title: string,
  body: string,
) => {
  console.log("📩 MOCK EMAIL SENT");
  console.log("To:", toEmail);
  console.log("Title:", title);
  console.log("Body:", body);
};
