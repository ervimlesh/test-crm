import { useSelector } from 'react-redux';
export default function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  
  const bgClass = theme === 'dark' ? 'bg-dark1' : 'bg-light1';
// className='bg-light text-gray '
  return (
    <div className={bgClass}>
      <div className={bgClass}>
        {children}
      </div>
    </div>
  );
}
