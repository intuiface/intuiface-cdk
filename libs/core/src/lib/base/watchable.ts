/**
 * Class that allow watching property changes on inherinting instance
 */
export class Watchable
{
    /**
     * Function to call when a property in the element changed to notify listeners
     * @param propertyKey
     * @param value
     */
    public notifyPropertyChanged(propertyKey: string, value: any): void
    {
    }
    
    /**
     * Function to subscribe to properties changes of the element
     * @param listener
     */
     public subscribeToPropertiesChanges(listener: PropertiesListener): void
     {
     }
 
     /**
      * function to unsubscribe from properties changes of the element
      * @param listener
      */
     public unsubscribeFromPropertiesChanges(listener: PropertiesListener): void
     {
     }
 
     /**
      * function to subscribe to one property changed
      * @param property
      * @param listener
      */
     public subscribeToPropertyChanged(property: string, listener: PropertyListener): void
     {
     }
 
     /**
      * function to unsubscribe from one property changed
      * @param property
      * @param listener
      */
     public unsubscribeFromPropertyChanged(property: string, listener: PropertyListener): void
     {
     }

    /**
     * Dispose watchable.
     */
    public dispose(): void 
    {
    }
}

export type PropertiesListener = (propertyKey: string, value: any) => void;
export type PropertyListener = (value: any) => void;
