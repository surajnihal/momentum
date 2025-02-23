import { SignIn } from "@clerk/nextjs";


export default function SignInPage() {
  return   <main className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(circle_at_50%_50%,#fdf4d3,#f77f4c,#f9114d)] text-center px-4 text-black"> 
  <SignIn routing="path" path="/sign-in" /></main>;
}
