const toggleSideNav = () => {
    myaside.classList.toggle("js-hide");
    myoverlay.classList.toggle("js-right-zero");
  };
  const clickOverlay = () => {
    myaside.classList.toggle("js-hide");
    myoverlay.classList.toggle("js-right-zero");
  };

  const formSubmit = (e) => {
    e.preventDefault();
    // window.location.replace(`http://127.0.0.1:5500/${untitledform.value}/`)
  }