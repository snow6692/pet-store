import { login } from "@/actions/user.action";
import { Button } from "../ui/button";
export default function Login() {
  return (
    <form action={login}>
      <Button type="submit">Signin with Google</Button>
    </form>
  );
}
