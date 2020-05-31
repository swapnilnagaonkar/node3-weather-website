const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')


const app = express();

const publicDirectoryPath = path.join(__dirname, '../public');
const viewPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));


app.get('', (req, res) => {
    res.render('index.hbs', {
        title : "Wheather APP",
        name : "Hare Krishna"
    });
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title : "About",
        name : "Hare Krishna"
    });
});

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        helpText : "This is help text",
        title : "Help",
        name : "Hare Krishna"
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location }) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
});


app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error : "Please enter the search"
        })
    }
    console.log(req.query.search)
    res.send({
        "products" : []
    });
});

app.get('/help/*', (req, res) => {
    res.render('404.hbs',{
        title : "404",
        name : "Hare Krishna",
        errorMessage : "Help Page Not Found"
    });
});

app.get('*', (req, res) => {
    res.render('404.hbs',{
        title : "404",
        name : "Hare Krishna",
        errorMessage : "Page Not Found"
    });
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});