import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import * as X from "../components/xcomponents";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <X.Container>
        <X.Image className="w-full" src="/images/test/test0.jpg" alt="Imagem de por do sol estilizada"></X.Image>
        <X.Image className="w-full" src="/images/test/test0.jpg" alt="Imagem de por do sol estilizada"></X.Image>
      </X.Container>
    </div>
  );
}
