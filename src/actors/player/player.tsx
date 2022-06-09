import React, { ReactElement } from "react";
import { filter, fromEvent, map, ReplaySubject, takeUntil } from "rxjs";
import styles from './player.module.css';

export class Player extends React.Component<{}, { top: string}> {
    // public topPos: number = 0;

    private onDestroy$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(props: any) {
        super(props);
        this.state = {
            top: '0%'
        }
    }

    componentDidMount(): void {
        fromEvent<KeyboardEvent>(document, 'keyup').pipe(
            filter((event: KeyboardEvent) => event.key === 'ArrowDown' || event.key === 'ArrowUp'),
            map((event: KeyboardEvent) => {
                const currentValue = Number(this.state.top.substring(0, this.state.top.length - 1));
                if (event.key === 'ArrowDown') {
                    if (currentValue === 90) {
                        return 0;
                    } else {
                        return currentValue + 10;
                    }
                } else {
                    if (currentValue === 0) {
                        return 90; 
                    } else {
                        return currentValue - 10;
                    }
                }
            }),
            takeUntil(this.onDestroy$)
        ).subscribe((value: number) => {
            this.setState({ top: value + '%'})
        });
    }

    componentWillUnmount(): void {
        this.onDestroy$.next(true);
        this.onDestroy$.complete();
    }

    public render(): ReactElement {
        return (
            <div className={styles.player} style={{top: this.state.top}}>
            </div>
        )
    };


};