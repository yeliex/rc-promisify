# rc-promisify

make react-components promisify 🎡

# Usage

```bash
npm install rc-promisify
# OR
yarn add rc-promisify
```

```tsx
import { Promisify } from 'rc-promisify';
import { Button, Switch } from 'antd';

const App = () => {
    const handleClick = async () => {
        return new Promise((resolve) => {
            setTimeout(resolve, 3000)
        });
    };

    return (
        <>
            <Promisify 
                component={Button} 
                trigger="onClick" 
                onClick={handleClick}
            />
            
            <Promisify 
                component={Swithc} 
                trigger={['onClick', 'onChange']} 
                onClick={handleClick}
                onChange={handleClick}
            />
        </>
    )
};
```

# API Reference
## Promisify
- `component: React.ComponentType` any ReactComponent with event callback and `loading` props
- `trigger: string | string[]` event(s) to hijack
- `...props` any other props of `component`
