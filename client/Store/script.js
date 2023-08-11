/*function deleteItem(id) {
  fetch(`http://localhost/crudAPI/crud.php/items/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .catch(err => console.log(err));
}*/
fetch('http://localhost/Semmandalluwa.lk/server/crud.php/items')
  .then(response => response.json())
  .then(data => {
    let output = '';
    data.forEach(function(item){
      output += `
        <div class="card mb-3">
  <img src="data:image/jpg;charset=utf8;base64,${item.image}" class="card-img-top" alt="Item Name">
  <div class="card-body">
    <h5 class="card-title">${item.title}</h5>
    <p class="card-text">${item.description}</p>
    <p class="card-text">
      <small class="text-muted">Category: ${item.category}</small>
      <br>
      <small class="text-muted">Price: ${item.price}</small>
      <br>
      <small class="text-muted">Rating: ${item.rating}</small>
    </p>
    <a href="#" class="btn btn-primary">Add to Cart</a>
  </div>
</div>
      `;
    });
    document.getElementById('data').innerHTML = output;
  })
  .catch(err => console.log(err));