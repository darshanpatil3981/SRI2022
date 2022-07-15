const LoginForm = ({
    handleSubmit,
    email,
    setEmail,
    password,
    setPassword
}) => {
    return(
        <form onSubmit={handleSubmit} className="mt-3">
            
            <div className="form-group mb-3">
                <label className='form-label'>Email address</label>
                <input type="email" placeholder="Enter email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="form-group mb-3">
                <label className='form-label'>Password</label>
                <input type="password" placeholder="Enter password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>

            <button disabled={!email || !password} className="btn btn-primary">Submit</button>
    
        </form>
    );
    
};

export default LoginForm;