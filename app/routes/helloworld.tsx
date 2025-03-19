import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import * as X from "../components/xcomponents";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function HelloWorld() {
  return (
    <div className="grid items-center justify-center">
      
      <div className="w-xl grid gap-8 items-center justify-center grid-flow-row">
        <X.Container className="items-center justify-center">
        <img src="/images/brand/logo.svg" className="h-max" />
        </X.Container>
        <X.Container className="w-xl">
          <X.Field type="email" placeholder="Email" name="Email"></X.Field>
          <X.Field type="password" placeholder="Password" name="Password"></X.Field>
          <X.Submit>Login</X.Submit>
        </X.Container>
        <X.Link href="">Esqueceu-se da Password?</X.Link>
      </div>
    </div>
  );
}
