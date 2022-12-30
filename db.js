// offine data
db.enablePersistence()
.catch(err => {
    if(err.code == 'failed-precondition'){
        // possibly multiple tabs opens at one time
        console.log(' presistence failed');
    }
    else if(err.code == 'unimplemeted'){
        // lack of browser support
        console.log(' presistence is not available');
    }
});

db.collection('Recipies').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
        // console.log(change, change.doc.data(), change.doc.id)
        if(change.type === 'added') {
            //add the document data to web page
            renderRecipe(change.doc.data(), change.doc.id)
        }
        if(change.type === 'removed') {
            //remove the document data to web page
            removeRecipe(change.doc.id)

        }
    })
});

// add new recipe
const form = document.querySelector('form');
form.addEventListener('submit', evt =>{
    evt.preventDefault();
 
    const recipe = {
        title: form.title.value,
        ingredients: form.ingredients.value
    }

    db.collection('Recipies').add(recipe)
    .catch(err => console.log(err));

    form.title.value = '';
    form.ingredients.value = ''
})

// delete a recipe

const receipeContainer = document.querySelector('.recipes');

receipeContainer.addEventListener('click', evt =>{
    // console.log(evt)
    if (evt.target.tagName === 'I'){
        const id = evt.target.getAttribute('data-id');
        db.collection('Recipies').doc(id).delete();
    }
})