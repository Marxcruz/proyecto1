import React from 'react';
import Chat from '../components/Chat';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ChatPage = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Sistema de Chat del Hospital
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Utilice este chat para comunicarse con nuestro personal médico o con otros pacientes.
          Seleccione la sala adecuada según sus necesidades.
        </p>
        <Chat />
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;
