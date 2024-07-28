import { Github, Twitter } from "../shared/icons";

export default function Footer() {
  return (
    <div className="absolute w-full py-5 text-center border-t border-accent-3">
      <p className="text-accent-6">
        A project by{" "}
        <a
          className="font-semibold underline-offset-4 transition-colors hover:underline"
          href="https://x.com/jogeshwar01"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jogeshwar Singh
        </a>
      </p>
      <div className="flex justify-center items-center space-x-4 mt-2">
        <a
          href="https://www.github.com/jogeshwar01"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2  rounded-full border border-accent-3 bg-black text-white px-6 py-2 transition-all duration-75 transform hover:border-white hover:scale-105"
        >
          <Github className="h-6 w-6" />
          <p className="font-medium">jogeshwar01</p>
        </a>
        <a
          href="https://www.x.com/jogeshwar01"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 rounded-full border border-accent-3 bg-custom-white-50 text-black px-6 hover:border-black py-2 transition-all duration-75 transform hover:scale-105"
        >
          <Twitter className="h-5 w-5 " />
          <p className="font-medium">jogeshwar01</p>
        </a>
      </div>
    </div>
  );
}
