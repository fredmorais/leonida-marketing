export const Icon = ({ name, size = 20 }: { name: 'menu'|'close'|'plus'|'minus'|'reset'|'back'|'pin'|'external'|'arrow'|'settings'; size?: number }) => {
  const paths = {
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>, close: <path d="m6 6 12 12M18 6 6 18"/>, plus: <path d="M12 5v14M5 12h14"/>, minus: <path d="M5 12h14"/>,
    reset: <path d="M4 9a8 8 0 1 1 1 8M4 9V4m0 5h5"/>, back: <path d="m15 18-6-6 6-6"/>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    external: <><path d="M14 4h6v6M20 4l-9 9"/><path d="M18 13v6H5V6h6"/></>, arrow: <path d="m9 18 6-6-6-6"/>,
    settings: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
  }
  return <svg className="block shrink-0" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}
