import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { TrendingUp } from 'lucide-react';
import { API_BASE_URL } from '../config';

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const RegisterHandler = async function (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await axios.post(`${API_BASE_URL}/register`, {
                name, email, password
            });
            setMessage(response.data.message);
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }
            navigate("/dashboard");
        } catch (err: unknown) {
            console.log(err);
            setMessage(axios.isAxiosError(err) ? err.response?.data?.message || "something went wrong" : "something went wrong")
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative isolate min-h-screen w-full overflow-hidden bg-[#f3f7f5] flex items-center justify-center px-4 py-10 font-sans">
            <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-[#00a96b]/[.08] blur-3xl" />
            <div className="absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-[#eabf61]/[.10] blur-3xl" />
            <div className="relative z-10 w-full max-w-[410px] overflow-hidden rounded-2xl border border-white/80 bg-white p-8 shadow-[0_24px_80px_rgba(16,43,53,0.15)] sm:p-10">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#087a4f] via-[#82c99e] to-[#e9c16f]" />
                
                {/* Logo / mark */}
                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-[#102b35] flex items-center justify-center shadow-lg shadow-[#102b35]/15">
                        <TrendingUp className="w-5.5 h-5.5 text-[#c5f36a]" strokeWidth={2.5} />
                    </div>
                    <span className="text-[#111827] text-xl font-bold tracking-tight">Stockly</span>
                </div>

                <div className="mb-6 text-center"><span className="rounded-full bg-[#e5f7ee] px-3 py-1 text-[10px] font-extrabold tracking-[.15em] text-[#087a4f]">JOIN STOCKLY</span><h1 className="mt-4 text-[#102b35] text-2xl font-bold mb-1 text-center">Create your account</h1>
                <p className="text-[#6B7F78] text-sm mt-2 text-center">Save reports and build a personal research history.</p></div>

                <form onSubmit={RegisterHandler} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="name" className="text-[#111827] text-xs font-semibold">
                            Full name
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-11 px-3.5 rounded-lg border border-[#dce6e2] text-sm text-[#102b35]
                                       outline-none focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10
                                       transition-all placeholder:text-[#879891] bg-[#fbfdfc]"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-[#111827] text-xs font-semibold">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-11 px-3.5 rounded-lg border border-[#dce6e2] text-sm text-[#102b35]
                                       outline-none focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10
                                       transition-all placeholder:text-[#879891] bg-[#fbfdfc]"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-[#111827] text-xs font-semibold">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-11 px-3.5 rounded-lg border border-[#dce6e2] text-sm text-[#102b35]
                                       outline-none focus:border-[#00a96b] focus:ring-2 focus:ring-[#00a96b]/10
                                       transition-all placeholder:text-[#879891] bg-[#fbfdfc]"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="h-11 mt-2 rounded-lg bg-[#102b35] text-white text-sm font-bold
                                   hover:bg-[#174653] active:bg-[#174653] transition-all duration-150 shadow-md shadow-[#102b35]/15
                                   disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center"
                    >
                        {loading ? "Creating account..." : "Sign up"}
                    </button>
                </form>

                {message && (
                    <p className="mt-4 text-xs text-center font-semibold text-red-500 bg-red-50 py-2 px-3 rounded-lg border border-red-100">
                        {message}
                    </p>
                )}

                <p className="text-center text-xs text-[#6B7F78] mt-6 font-medium">
                    Already registered?{" "}
                    <Link to="/login" className="text-[#111827] font-bold hover:underline transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
