#! /usr/bin/env python

import os
import pandas as pd

for filename in os.listdir('csv'):
    if filename.endswith('.csv'):
        df = pd.read_csv('csv/' + filename)
        for hour in range(0, 24):
            df_hour = df[df['hour'] == hour].drop(df.columns[[0, 1]], axis=1)
            df_hour.to_csv('json/' + filename.rstrip('.csv') + str(hour).zfill(2),
                        index = False)
