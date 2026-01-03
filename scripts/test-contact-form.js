// Test script to send a demo email through your contact form API
// Run with: node scripts/test-contact-form.js

const testContactForm = async () => {
  try {
    console.log("🧪 Testing contact form API...\n");

    const testData = {
      name: "Test User - Demo Message",
      email: "demo@example.com",
      company: "Portfolio Testing",
      message:
        "This is a demo message to test the contact form functionality. If you receive this email, your contact form is working correctly!",
    };

    console.log("📤 Sending test message with data:");
    console.log(JSON.stringify(testData, null, 2));
    console.log("\n");

    const response = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("✅ SUCCESS! Message sent successfully!");
      console.log("📧 Check syedaliabbas1124@gmail.com for the email");
      console.log("\nResponse:", result);
    } else {
      console.log("❌ FAILED! Error sending message");
      console.log("Error:", result);
      
      if (result.error?.includes("API key")) {
        console.log("\n⚠️  Make sure you've set up your Resend API key in .env.local");
        console.log("   1. Go to https://resend.com and sign up");
        console.log("   2. Get your API key");
        console.log("   3. Add it to .env.local as RESEND_API_KEY=re_your_key");
        console.log("   4. Restart your dev server");
      }
    }
  } catch (error) {
    console.log("❌ ERROR:", error.message);
    console.log("\n⚠️  Make sure your dev server is running:");
    console.log("   npm run dev");
  }
};

testContactForm();
