import { Link } from "react-router-dom"

interface Props {
  url?: string
}

const Logo = ({url}:Props) => {
  return (
    <Link to={url ?? '/'}>
    <div>Logo</div>
    </Link>
  )
}

export default Logo