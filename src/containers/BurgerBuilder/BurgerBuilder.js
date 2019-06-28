import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/BuildControls/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }

    state = {
        ingredients: null,
        totalPrice: 0,
        purchaseable: false,
        purchasing: false,
        loading: false,
        error: null,
    }

    componentDidMount() {
        axios.get('https://react-my-burger-1a064.firebaseio.com/ingredients.json').then(response => {
            this.setState({ ingredients: response.data });
        }).catch((error) => {
            this.setState({error: true});
        });
    }

    addIngredientHandler = (type) => {
        const updatedIngredients = {
            ...this.state.ingredients
        };
        const updatedCount = this.state.ingredients[type] + 1;
        updatedIngredients[type] = updatedCount;

        const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
        this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        if (this.state.ingredients[type] > 0) {
            const updatedIngredients = {
                ...this.state.ingredients
            };
            const updatedCount = this.state.ingredients[type] - 1;
            updatedIngredients[type] = updatedCount;

            const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
            this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
            this.updatePurchaseState(updatedIngredients);
        }
    }

    updatePurchaseState(updatedIngredients) {
        const sum = Object.keys(updatedIngredients).map(igKey => {
            return updatedIngredients[igKey]
        }).reduce((sum, el) => {
            return sum + el;
        }, 0);
        this.setState({ purchaseable: sum > 0 });
    }

    purchaseHandler = () => {
        this.setState({ purchasing: true });
    }

    purchaseCancelHandler = () => {
        this.setState({ purchasing: false });
    }

    purchaseContinueHandler = () => {
        // alert('Continued.');
        this.setState({ loading: true });
        const order = {
            ingredients: this.state.ingredients,
            price: this.state.totalPrice,
            customer: {
                name: 'Max',
                address: {
                    street: 'Teststreet 1',
                    zipCode: '31234',
                    country: 'United States',
                },
                email: 'test@test.com',
            },
            deliveryMethod: 'fastest'
        };
        axios.post('/orders.json', order).then((response) => {
            this.setState({ loading: false, purchasing: false });
        }).catch((error) => {
            this.setState({ loading: false, purchasing: false });
        });
    }

    render() {
        let orderSummary = null;
        let burger = this.state.error? <p>ingredients can't be loaded.</p> : <Spinner />;

        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients={this.state.ingredients} />
                    <BuildControls
                        ingredientAdded={this.addIngredientHandler}
                        ingredientRemoved={this.removeIngredientHandler}
                        disabled={this.state.ingredients}
                        purchaseable={this.state.purchaseable}
                        price={this.state.totalPrice}
                        ordered={this.purchaseHandler} />
                </Aux>
            );

            orderSummary = <OrderSummary
            ingredients={this.state.ingredients}
            totalPrice={this.state.totalPrice.toFixed(2)}
            purchaseCanceled={this.purchaseCancelHandler}
            purchaseContinued={this.purchaseContinueHandler} />;
        };

        if (this.state.loading) {
            orderSummary = <Spinner />;
        };

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

export default WithErrorHandler(BurgerBuilder, axios);