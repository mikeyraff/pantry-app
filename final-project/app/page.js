'use client';
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [newRecipe, setNewRecipe] = useState({ name: '', items: [] });

  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      try {
        await addDoc(collection(db, 'items'), {
          name: newItem.name.trim(),
          quantity: parseInt(newItem.quantity, 10),
        });
        setNewItem({ name: '', quantity: '' });
      } catch (error) {
        console.error('Error adding item: ', error);
      }
    }
  };

  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setItems(itemsArr);

      const totalQuantity = itemsArr.reduce(
        (sum, item) => sum + parseInt(item.quantity, 10),
        0
      );
      setTotal(totalQuantity);
    });

    const rq = query(collection(db, 'recipes'));
    const unsubscribeRecipes = onSnapshot(rq, (querySnapshot) => {
      const recipesArr = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setRecipes(recipesArr);
    });

    return () => {
      unsubscribe();
      unsubscribeRecipes();
    };
  }, []);

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  const deleteRecipe = async (id) => {
    try {
      await deleteDoc(doc(db, 'recipes', id));
    } catch (error) {
      console.error('Error deleting recipe: ', error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity >= 0) {
      try {
        const itemRef = doc(db, 'items', id);
        await updateDoc(itemRef, { quantity: newQuantity });
      } catch (error) {
        console.error('Error updating quantity: ', error);
      }
    }
  };

  const addRecipe = async (e) => {
    e.preventDefault();
    if (newRecipe.name !== '' && newRecipe.items.length > 0) {
      try {
        await addDoc(collection(db, 'recipes'), newRecipe);
        setNewRecipe({ name: '', items: [] });
      } catch (error) {
        console.error('Error adding recipe: ', error);
      }
    }
  };

  const addRecipeItem = (item) => {
    setNewRecipe({
      ...newRecipe,
      items: [...newRecipe.items, item],
    });
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm '>
        <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'>
          <form className='grid grid-cols-6 items-center text-black' onSubmit={addItem}>
            <input
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border'
              type='text'
              placeholder='Enter Item'
              required
            />
            <input
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: e.target.value })
              }
              className='col-span-2 p-3 border mx-3'
              type='number'
              placeholder='Enter Quantity'
              required
            />
            <button
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl col-span-1'
              type='submit'
            >
              +
            </button>
          </form>
          <div className='my-4'>
            <input
              type='text'
              placeholder='Search items...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='p-3 border w-full'
            />
          </div>
          <ul>
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className='my-4 w-full flex justify-between bg-white text-black'
              >
                <div className='p-4 w-full flex justify-between items-center'>
                  <div className='flex justify-between w-full'>
                    <span className='capitalize'>{item.name}</span>
                    <span className='ml-8'>Quantity: {item.quantity}</span>
                  </div>
                  <div>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className='text-black bg-slate-200 hover:bg-slate-300 px-2 mx-1'
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className='text-black bg-slate-200 hover:bg-slate-300 px-2 mx-1'
                    >
                      +
                    </button>
                    <button
                      onClick={() => addRecipeItem(item)}
                      className='text-black bg-slate-200 hover:bg-slate-300 px-2 mx-1'
                    >
                      Add to Recipe
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16 text-black'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
          {filteredItems.length > 0 && (
            <div className='flex justify-between p-3'>
              <span>Total</span>
              <span>{total}</span>
            </div>
          )}
        </div>
        <h2 className='text-3xl p-4 text-center'>Recipes</h2>
        <div className='bg-slate-800 p-4 rounded-lg w-full'>
          <form className='grid grid-cols-6 items-center text-black' onSubmit={addRecipe}>
            <input
              value={newRecipe.name}
              onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
              className='col-span-4 p-3 border'
              type='text'
              placeholder='Enter Recipe Name'
              required
            />
            <button
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl col-span-2'
              type='submit'
            >
              Add Recipe
            </button>
          </form>
          <ul>
            {recipes.map((recipe) => (
              <li
                key={recipe.id}
                className='my-4 w-full flex justify-between bg-white text-black p-4 rounded-lg'
              >
                <div>
                  <h3 className='text-xl'>{recipe.name}</h3>
                  <ul>
                    {recipe.items.map((item, index) => (
                      <li key={index}>{item.name} - {item.quantity}</li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => deleteRecipe(recipe.id)}
                  className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16 text-black'
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}



