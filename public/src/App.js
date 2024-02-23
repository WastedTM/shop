import Header from "./Components/Header";
import Footer from "./Components/Footer";
import React from "react";
import {Routes, Route, BrowserRouter as Router} from "react-router-dom";
import Home from "./Components/Home";
import About from "./Components/About";
import Contacts from "./Components/Contacts";
import Authorization from "./Components/Authorization";
import ShowFullItem from "./Components/ShowFullItem";
import Other from "./Components/Other";
import Registration from "./Components/Registration";
import Profile from "./Components/Profile";
import ProductOrder from "./Components/ProductOrder";
import axios from "axios";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            currentUser: {},
            users: [],

            orders: [],
            currentItems: [],
            items: [],
            orderedProducts: [],
        }
        this.addToOrder = this.addToOrder.bind(this)
        this.deleteOrder = this.deleteOrder.bind(this)
        this.chooseCollection = this.chooseCollection.bind(this)
        this.addOneOrder = this.addOneOrder.bind(this)
        this.setCurrentUser = this.setCurrentUser.bind(this)
        this.createUser = this.createUser.bind(this)
        this.logOut = this.logOut.bind(this)
        this.updateCurrentUserInformation = this.updateCurrentUserInformation.bind(this)
    }

    componentDidMount() {
        this.getItems();
        this.getUsers();
        this.getOrderedProducts();
    }

    addToOrder = (item) => {
        let check = false
        this.state.orders.forEach(el => {
            if (el.id === item.id) {
                check = true
            }
        })

        if (!check) {
            this.setState({orders: [...this.state.orders, item]})
        }
    }

    updateCurrentUserInformation = (id, newUser) => {
        this.setState((prevState) => ({
            currentUser: {
                id: id,
                username: newUser.username,
                email: newUser.email,
                phoneNumber: newUser.phoneNumber,
                profileImage: newUser.profileImage
            }
        }))
    }

    setCurrentUser = (id, newUser) => {
        let user = this.state.users.find(user => user.id === id)

        if(user === undefined){
            user = newUser
        }

        console.log(user)
        this.setState((prevState) => ({
            isLoggedIn: !prevState.isLoggedIn,
            currentUser: {
                id: id,
                username: user.username,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profileImage: user.profileImage
            }
        }), () => {
            console.log(this.state.isLoggedIn)
        })
    };

    addOneOrder = (item) => {
        this.setState({orders: [item]})
    }

    deleteOrder = (itemId) => {
        this.setState({orders: this.state.orders.filter(el => el.id !== itemId)})
    }

    chooseCollection = (collection) => {
        if (collection === 'all') {
            this.setState({currentItems: this.state.items})
            return
        }

        this.setState({
            currentItems: this.state.items.filter(el => el.collection === collection)
        })
    }

    getItems = async () => {
        await axios.get('/Data/products')
            .then((response) => {
                this.setState({items: response.data})
                this.setState({currentItems: response.data})
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getUsers = async () => {
        await axios.get('/Data/users').then((response) => {
            this.setState({users: response.data})
        }).catch((error) => {
            console.log(error)
        })
    }

    getOrderedProducts = async () => {
        await axios.get('/Data/orders').then((response) => {
            this.setState({orderedProducts: response.data})
        }).catch((error) => {
            console.log(error)
        })
    }

    createUser = async (user) => {
        console.log(user);
        await axios.post('/Data/createUser', user);

        await this.setState((prevState) => ({
            users: [...prevState.users, user],
        }));

        console.log(this.state.users)
    }

    createOrder = async (order) => {
        console.log(order)
        await axios.post('/Data/createOrder', order)
    }

    logOut(){
        this.setState((prevState)=> ({
            isLoggedIn: !prevState.isLoggedIn,
            currentUser: {}
        }))
    }

    render() {
        return (
            <Router>
                <div className='wrapper'>
                    <Header orders={this.state.orders} onDelete={this.deleteOrder} isLoggedIn={this.state.isLoggedIn}/>
                    <Routes>
                        <Route path="/" element={<Home
                            chooseCollection={this.chooseCollection}
                            currentItems={this.state.currentItems}
                            addToOrder={this.addToOrder}
                        />}/>
                        <Route path="/About" element={<About/>}/>
                        <Route path="/Contacts" element={<Contacts/>}/>
                        <Route path="/Authorization" element={<Authorization users={this.state.users}
                                                                             setCurrentUser={this.setCurrentUser}/>}/>
                        <Route path="/Registration"
                               element={<Registration users={this.state.users} setCurrentUser={this.setCurrentUser} createUser={this.createUser}/>}/>
                        <Route path="/Profile" element={<Profile user={this.state.currentUser} logOut={this.logOut}  setCurrentUser={this.updateCurrentUserInformation}/>}/>
                        <Route path="/ProductOrder" element={<ProductOrder items={this.state.orders} createOrder={this.createOrder}/>}/>
                        <Route path="/Product/:id"
                               element={<ShowFullItem items={this.state.items} onAdd={this.addToOrder}
                                                      addOneElement={this.addOneOrder}/>}/>
                        <Route path="*" element={<Other/>}/>
                    </Routes>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;