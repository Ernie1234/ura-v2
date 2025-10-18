import { Link } from "react-router-dom";

interface Props {
  url?: string;
}

const Logo = ({ url }: Props) => {
  return (
    <Link to={url ?? "/"} className="flex items-center gap-2">
      <img
        src="/images/Ura_logo 1.svg"
        alt="Ura Logo"
        className="scale-200 hover:spin-slow"
      />
      {/* <div className="text-3xl text-orange-500 font-bold">Ura</div> */}
    </Link>
  );
};

export default Logo;
