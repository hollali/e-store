import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-none border border-gray-200 rounded-2xl",
            headerTitle: "text-xl font-bold text-gray-900",
            headerSubtitle: "text-sm text-gray-500",
            socialButtonsBlockButton:
              "border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors",
            socialButtonsBlockButtonText: "text-gray-700 font-medium text-sm",
            dividerLine: "bg-gray-200",
            dividerText: "text-gray-400 text-xs",
            formFieldLabel: "text-sm font-medium text-gray-700",
            formFieldInput:
              "rounded-lg border-gray-300 focus:border-primary focus:ring-primary/20 text-sm",
            formButtonPrimary:
              "bg-primary hover:bg-primary/90 rounded-lg text-sm font-semibold transition-colors shadow-none",
            footerActionText: "text-sm text-gray-500",
            footerActionLink: "text-primary font-medium hover:text-primary/80 transition-colors",
            identityPreviewText: "text-sm text-gray-700",
            identityPreviewEditButton: "text-primary font-medium text-sm",
          },
        }}
        signUpUrl="/sign-up"
      />
    </div>
  );
}
