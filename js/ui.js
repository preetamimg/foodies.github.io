const recipes = document.querySelector(".recipes");
document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add recipe form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});


const renderRecipe = (data, id) => {
  const html = `
      <div class="card-panel recipe white row" data-id="${id}">
          <img src="img/dish.png" alt="recipe thumb">
          <div class="recipe-details">
            <div class="recipe-title">${data.title}</div>
            <div class="recipe-ingredients">${data.ingredients}</div>
          </div>
          <div class="recipe-delete">
            <i class="material-icons" data-id="${id}">delete_outline</i>
          </div>
    </div>
  `
  recipes.innerHTML += html;
}

// remove receipe from dom
const removeRecipe = (id) => {
  const recipe = document.querySelector(`.recipe[data-id=${id}]`);
  recipe.remove();
}


// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later.
  deferredPrompt = e;
  // Update UI notify the user they can install the PWA
  showInstallPromotion();
  // Optionally, send analytics event that PWA install promo was shown.
  console.log(`'beforeinstallprompt' event was fired.`);
});

let downloadBox = document.getElementById('downloadBox');
let downloadBtn = document.getElementById('downloadBtn');
let hideDownloadBoX = document.getElementById('hideDownloadBoX');

hideDownloadBoX.addEventListener('click', ()=> {
  downloadBox.style.display='none';
})

function showInstallPromotion() {
  downloadBox.style.display='block';
}
downloadBtn.addEventListener('click', async () => {
    // Hide the app provided install promotion
    // hideInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
  });


//   window.addEventListener('appinstalled', () => {
//     // Hide the app-provided install promotion
//     hideInstallPromotion();
//     // Clear the deferredPrompt so it can be garbage collected
//     deferredPrompt = null;
//     // Optionally, send analytics event to indicate successful install
//     console.log('PWA was installed');
//   });