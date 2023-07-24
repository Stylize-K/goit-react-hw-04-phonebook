import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import css from './App.module.css';

export const App = () => {
  const [contacts, setContacts] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('contacts')) ?? [
        { id: 'id-1', name: 'Андрій Шевченко', number: '+38-097-325-34-97' },
        { id: 'id-2', name: 'Сергій Ребров', number: '+38-096-421-65-70' },
        {
          id: 'id-3',
          name: 'Руслан Ротань',
          number: '+38-063-889-23-12',
        },
        { id: 'id-4', name: 'Андрій Ярмоленко', number: '+38-050-455-67-90' },
      ]
    );
  });

  const [filter, setFilter] = useState('');

  //При кожній зміні масиву контактів - зберігаємо їх в localStorage
  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  //Функція генерації id. Сама Функція nanoid() приймає необов'язковий аргумент, що задає довжину id
  const generetedId = () => {
    return nanoid(5);
  };

  // Функція оновлення полів фільтру
  const handleChangeFilter = event => {
    const { value } = event.currentTarget;
    setFilter(value);
  };

  //Функція фільтрації контактів
  const getFilteredContacts = () => {
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  //Функція видалення контакту зі списку контактів
  const deleteContact = deleteId => {
    setContacts(PrevState =>
      PrevState.filter(contact => contact.id !== deleteId)
    );
    setFilter('');
  };

  //Функція обробки сабміту форми - додаємо дані в state (дані отримуємо з компонента ContactForm)
  const formSubmitHandler = data => {
    console.log(data);
    //Заборона додавати контакти, імена яких вже присутні у телефонній книзі.
    if (contacts.some(contact => contact.name === data.name)) {
      alert(`${data.name} is already in contacts.`);
      return;
    }
    setContacts([
      ...contacts,
      { id: generetedId(), name: data.name, number: data.number },
    ]);
  };

  const filteredContacts = getFilteredContacts();

  return (
    <div
      style={{
        padding: '20px 0 0 0',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#010101',
      }}
    >
      <h1 className={css.title}>Phonebook</h1>
      <ContactForm onSubmit={formSubmitHandler} />
      <h2 className={css.subtitle}>Contacts</h2>
      <p className={css.total}>
        Total contacts:
        <span className={css.total_count}> {contacts.length}</span>
      </p>
      <Filter value={filter} onChange={handleChangeFilter} />
      <ContactList
        filteredContacts={filteredContacts}
        onDeleteContact={deleteContact}
      />
    </div>
  );
};
