import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["list"]

  static values = { carId: Number }

  connect() {
    console.log("hello from garage controller!")
    this.getAllCars()
  }

  submit(event) {
    event.preventDefault();
    const garageName = "garage-1251"
    const garageUrl = `https://wagon-garage-api.herokuapp.com/${garageName}/cars`
    const formData = new FormData(event.currentTarget)
    const bodyRequest = JSON.stringify(Object.fromEntries(formData))
    event.currentTarget.reset() // Limpa o form antes do submit

    fetch(garageUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: bodyRequest
    })
    .then(response => response.json())
    .then(data => this.insertCar(data))
  }

  getAllCars() {
    // 1. Criar a URL com o fetch p/ API
    const garageName = "garage-1251"
    const garageUrl = `https://wagon-garage-api.herokuapp.com/${garageName}/cars`
    
    fetch(garageUrl)
    .then(response => response.json())
    .then(data => {
      // 2. Iterar sobre cada carro
      data.forEach(car => {
        // 3. Inserir cada carro na lista de resultados
        this.insertCar(car)    
      });
    })    
  }

  insertCar(car) {
    console.log(car.brand, car.owner, car.model)
    const carName = `${car.brand}${car.model}`
    // 1. Precisamos criar o card do carro
    const carCard = `<div class="car">
      <div class="car-image">
        <img src="http://loremflickr.com/280/280/${carName.replace(" ", "")}" />
      </div>
      <div class="car-info">
        <h4>${car.brand} ${car.model}</h4>
        <p><strong>Owner:</strong> ${car.owner}</p>
        <p><strong>Plate:</strong> ${car.plate}</p>
      </div>
      <button data-action="click->garage#removeCar" data-garage-car-id-value="${car.id}">Delete car</button>
    </div>`
    // 2. Inserir o card, na lista de carros
    this.listTarget.insertAdjacentHTML('beforeend', carCard)
  }

  removeCar(event) {
    // console.dir(event.target.dataset)
    const garageUrl = `https://wagon-garage-api.herokuapp.com/cars/${event.target.dataset.garageCarIdValue}`
    fetch(garageUrl, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"}
    })
    .then(() => this.listTarget.innerHTML = "")
    .then(() => this.getAllCars())
    
  }
}
