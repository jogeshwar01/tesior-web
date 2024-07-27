import { Github } from "../shared/icons";

export default function Footer() {
  return (
    <div className="absolute w-full py-5 text-center border-t border-accent-3">
      <p className="text-accent-6">
        A project by{" "}
        <a
          className="font-semibold underline-offset-4 transition-colors hover:underline"
          href="https://twitter.com/jogeshwar01"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jogeshwar Singh
        </a>
      </p>
      <a
        href="https://www.github.com/jogeshwar01"
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto mt-2 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-accent-3 bg-black text-white hover:border-white px-6 py-2 transition-all duration-75 hover:scale-105"
      >
        <Github className="h-6 w-6" />
        <p className="font-medium">jogeshwar01</p>
      </a>
    </div>
  );
}
