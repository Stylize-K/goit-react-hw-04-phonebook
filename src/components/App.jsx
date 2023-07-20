import { Component } from 'react';
import { nanoid } from 'nanoid';
import { ContactForm } from './ContactForm/ContactForm';
import { Filter } from './Filter/Filter';
import { ContactList } from './ContactList/ContactList';
import css from './App.module.css';

export class App extends Component {
  state = {
    contacts: [
      { id: 'id-1', name: 'Андрій Шевченко', number: '+38-097-325-34-97' },
      { id: 'id-2', name: 'Сергій Ребров', number: '+38-096-421-65-70' },
      {
        id: 'id-3',
        name: 'Руслан Ротань',
        number: '+38-063-889-23-12',
      },
      { id: 'id-4', name: 'Андрій Ярмоленко', number: '+38-050-455-67-90' },
    ],
    filter: '',
  };

  // Якщо користувач заходить перший раз - початковий список контактів береться зі State. Якщо в localStorage зберігається список контактів користувача - то записати їх у State.
  componentDidMount() {
    const contacts = localStorage.getItem('contacts');
    const parsedContacts = JSON.parse(contacts);
    if (parsedContacts) {
      this.setState({ contacts: parsedContacts });
    }
  }

  // Якщо користувач оновив список контактів - записати зміни в localStorage.
  componentDidUpdate(prevProps, prevState) {
    if (this.state.contacts !== prevState.contacts) {
      localStorage.setItem('contacts', JSON.stringify(this.state.contacts));
    }
  }

  //Метод генерації id. Функція nanoid()  приймає необов'язковий аргумент, що задає довжину id
  generetedId = () => {
    return nanoid(5);
  };

  // Метод оновлення полів фільтру
  handleChangeFilter = event => {
    const { name, value } = event.currentTarget;
    this.setState({ [name]: value });
  };

  //Метод фільтрації контактів
  getFilteredContacts = () => {
    const { filter, contacts } = this.state;
    const normalizedFilter = filter.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(normalizedFilter)
    );
  };

  //Метод видалення контакту зі списку контактів
  deleteContact = deleteId => {
    this.setState(PrevState => ({
      contacts: PrevState.contacts.filter(contact => contact.id !== deleteId),
    }));
    this.setState({ filter: '' });
  };

  //Метод обробки сабміту форми - додаємо дані в state (дані отримуємо з компонента ContactForm)
  formSubmitHandler = data => {
    const { contacts } = this.state;
    console.log(data);
    //Заборона додавати контакти, імена яких вже присутні у телефонній книзі.
    if (contacts.some(contact => contact.name === data.name)) {
      alert(`${data.name} is already in contacts.`);
      return;
    }
    this.setState({
      contacts: [
        ...contacts,
        { id: this.generetedId(), name: data.name, number: data.number },
      ],
    });
  };

  render() {
    const filteredContacts = this.getFilteredContacts();
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
        <ContactForm onSubmit={this.formSubmitHandler} />
        <h2 className={css.subtitle}>Contacts</h2>
        <p className={css.total}>
          Total contacts:
          <span className={css.total_count}> {this.state.contacts.length}</span>
        </p>
        <Filter value={this.state.filter} onChange={this.handleChangeFilter} />
        <ContactList
          filteredContacts={filteredContacts}
          onDeleteContact={this.deleteContact}
        />
      </div>
    );
  }
}
