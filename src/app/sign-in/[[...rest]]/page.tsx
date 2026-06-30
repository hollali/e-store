import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <div className="w-full max-w-[440px]">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Sign in</h1>
          <p className="text-gray-500 mt-1.5 text-sm">Welcome back to AfricVogue</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-8">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none p-0",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton:
                  "border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition-colors text-sm",
                socialButtonsBlockButtonText: "text-gray-600 font-normal text-sm",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-400 text-xs",
                formFieldLabel: "text-sm font-medium text-gray-700 mb-1",
                formFieldInput:
                  "rounded-lg border-gray-300 focus:border-gray-400 focus:ring-gray-400 py-2 text-sm w-full",
                formButtonPrimary:
                  "bg-gray-900 hover:bg-gray-800 rounded-lg py-2 text-sm font-medium transition-colors w-full",
                footerActionText: "text-sm text-gray-500",
                footerActionLink: "text-sm text-gray-900 font-medium hover:underline",
                identityPreviewText: "text-sm text-gray-700",
                identityPreviewEditButton: "text-sm text-gray-900",
              },
            }}
            signUpUrl="/sign-up"
          />
        </div>
      </div>
    </div>
  );
}
