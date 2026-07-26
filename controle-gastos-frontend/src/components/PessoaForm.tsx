import { useState } from 'react';
import { api } from '../api/api';
import type { CriarPessoaDTO } from '../types';

// Formulário responsável pelo cadastro de novas pessoas.
export default function PessoaForm({ onCreated }: { onCreated: () => void }) {
    // Armazena os dados preenchidos no formulário.
    const [form, setForm] = useState<CriarPessoaDTO>({ nome: '', idade: 0 });

    // Controla o estado de carregamento durante o envio.
    const [loading, setLoading] = useState(false);

    // Envia os dados do formulário para a API.
    const handleSubmit = async (e: React.FormEvent) => {
        // Impede o recarregamento da página ao enviar o formulário.
        e.preventDefault();

        setLoading(true);

        try {
            // Cadastra a pessoa no sistema.
            await api.createPessoa(form);

            // Limpa os campos do formulário após o cadastro.
            setForm({ nome: '', idade: 0 });

            // Atualiza a lista de pessoas na tela.
            onCreated();
        } catch (error: any) {
            // Exibe a mensagem de erro retornada pela API.
            alert(error.message);
        } finally {
            // Finaliza o estado de carregamento.
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="text-2xl font-semibold mb-5">Cadastrar Pessoa</h2>

            <div className="space-y-4">
                <input
                    type="text"
                    placeholder="Nome da pessoa"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                <input
                    type="number"
                    placeholder="Idade"
                    value={form.idade || ''}
                    onChange={(e) => setForm({ ...form, idade: Number(e.target.value) })}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="120"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition disabled:opacity-70"
                >
                    {loading ? 'Cadastrando...' : 'Cadastrar Pessoa'}
                </button>
            </div>
        </form>
    );
}