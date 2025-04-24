
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addContact, removeContact, editContact } from "./store";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f6fbe9;
    margin: 0;
    font-family: "Roboto", sans-serif;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 6rem;
  background-color: #ffffd8;
  border-radius:8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const ContactItem = styled.div`
  display: flex;
  justify-content: space-between;
  background: #aacb73;
  padding: 1rem;
  margin-bottom: 0.5rem;
`;
const Input = styled.input`
background-color:#f6fbe9;
`

const Button = styled.button`
  margin-left: 0.5rem;
  cursor: pointer;
  background-color: #cde990;
  border:none;
  border-radius: 8px;
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
`;

export default function ContactList() {
  const contacts = useSelector((state) => state.contacts);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editId, setEditId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = contacts.slice(indexOfFirstItem, indexOfLastItem);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      dispatch(editContact({ ...formData, id: editId }));
      setEditId(null);
    } else {
      dispatch(addContact({ ...formData, id: uuidv4() }));
    }
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleEdit = (contact) => {
    setFormData(contact);
    setEditId(contact.id);
  };

  const handleDelete = (id) => {
    dispatch(removeContact(id));
  };

  const totalPages = Math.ceil(contacts.length / itemsPerPage);

  return (
    <>
      <GlobalStyle />
      <Container>
        <h1>Lista de Contatos</h1>
        <ContactForm onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Telefone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <Button type="submit">{editId ? "Salvar" : "Adicionar"}</Button>
        </ContactForm>

        {currentContacts.map((contact) => (
          <ContactItem key={contact.id}>
            <div>
              <strong>{contact.name}</strong><br />
              {contact.email}<br />
              {contact.phone}
            </div>
            <div>
              <Button onClick={() => handleEdit(contact)}>Editar</Button>
              <Button onClick={() => handleDelete(contact.id)}>Remover</Button>
            </div>
          </ContactItem>
        ))}

        <PaginationControls>
          <Button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
            Anterior
          </Button>
          <span>Página {currentPage} de {totalPages}</span>
          <Button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
            Próxima
          </Button>
        </PaginationControls>
      </Container>
    </>
  );
}
