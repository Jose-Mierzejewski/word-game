let $html = document.documentElement;

function updateButton() {
  let dark = $html.classList.contains("dark");
  let other_theme;
  if ( dark ) {
    $toggle.ariaPressed = "true";
    other_theme = "light"; 
  } else {
    $toggle.ariaPressed = "false";
    other_theme = "dark";
  }
  let label = "Change theme to " + other_theme;
  $toggle.ariaLabel = label;
  $toggle.title = label;
}

let $toggle = document.createElement("button");
$toggle.type = "button";
$toggle.classList.add( "theme-toggle" );
$toggle.innerText = "Theme Toggle";

function toggleTheme() {
  $html.classList.toggle( "dark" );
  updateButton();
}
$toggle.onclick = toggleTheme;

updateButton();
document.body.appendChild( $toggle );