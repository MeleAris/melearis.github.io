export default function Loader({ visible }) {
  return (
    <div id="ftco-loader" className={['fullscreen', visible ? 'show' : ''].filter(Boolean).join(' ')}>
      <svg className="circular" width="48px" height="48px">
        <circle className="path-bg" cx="24" cy="24" r="22" fill="none" strokeWidth="4" stroke="#eeeeee" />
        <circle
          className="path"
          cx="24"
          cy="24"
          r="22"
          fill="none"
          strokeWidth="4"
          strokeMiterlimit="10"
          stroke="#000077"
        />
      </svg>
    </div>
  );
}
