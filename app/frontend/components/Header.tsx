import clsx from "clsx"

const Header = () => {
  return (
    <header className={clsx("fixed top-10 inset-x-1/12", "flex justify-between items-center")}>
      <div className={clsx("text-2xl font-bold")}>Reviews</div>

      <div>
        <appkit-button />
      </div>
    </header>
  )
}

export default Header
